const httpStatus = require('http-status');
const excelToJson = require('convert-excel-to-json');
// const xlsx = require('xlsx');
const UserDao = require('../dao/UserDao');
const ResultDao = require('../dao/ResultDao');
const responseHandler = require('../helper/responseHandler');
const logger = require('../config/logger');

const calculateSubjectTotal = (total) => {
    return total;
};
const calculateSubjectPercentage = (totalSubNumber, subjectName) => {
    const subjectNumbers = { bangla: 100, english: 100, ICT: 75 };
    const percentage = (totalSubNumber / subjectNumbers[subjectName]) * 100;
    return Math.min(Math.floor(percentage), 100);
};

const calculateGradePoint = (percentage) => {
    const gradePointTable = [
        { minPercentage: 80, gradePoint: 5 },
        { minPercentage: 70, gradePoint: 4 },
        { minPercentage: 60, gradePoint: 3.5 },
        { minPercentage: 50, gradePoint: 3 },
        { minPercentage: 40, gradePoint: 2 },
        { minPercentage: 33, gradePoint: 1 },
        { minPercentage: 0, gradePoint: 0 },
    ];

    const { gradePoint } = gradePointTable.find(({ minPercentage }) => {
        return percentage >= minPercentage;
    });
    return gradePoint;
};

const getTotalFailedSubjects = (subjectTotal) => {
    let failedSubjects = 0;
    Object.keys(subjectTotal).forEach((subject) => {
        if (subjectTotal[subject] < 30) {
            failedSubjects += 1;
        }
    });
    return failedSubjects;
};

const calculateGPA = (
    totalGradePointParm,
    eachSubjectGradePoints,
    subjectTotalNumbers,
    optionalSubject,
) => {
    const totalSubject = Object.keys(subjectTotalNumbers).length - 1;
    const hasFailedSubject = getTotalFailedSubjects(subjectTotalNumbers);
    const subtractOptionalSubject = eachSubjectGradePoints[`${optionalSubject}_GP`] >= 2 ? 2 : 0;
    console.log(subtractOptionalSubject);
    if (hasFailedSubject > 0) {
        return 'Failed';
    }
    return (totalGradePointParm - subtractOptionalSubject) / totalSubject;
};

const calculateTotalMarks = (subjects) => {
    const total = Object.values(subjects)
        .filter((mark) => {
            return !['N', 'A', 'O'].includes(mark);
        })
        .reduce((acc, mark) => {
            return acc + mark;
        }, 0);
    return total;
};

const calculateTotalGradePoint = (calculateGradePoints) => {
    return Object.values(calculateGradePoints).reduce((total, value) => {
        return total + value;
    }, 0);
};

const calculateSubjectNumbers = (subjectMarks, hasSubjectPosition, type, resultTransformFn) => {
    const result = {};
    Object.entries(subjectMarks).forEach(([key, value]) => {
        const [subjectName, subjectPosition] = key.split('_');
        let fullSubjectName = subjectName;
        if (hasSubjectPosition && subjectPosition) {
            fullSubjectName = `${subjectName}_${subjectPosition}`;
        }

        const propertyKey = `${fullSubjectName}${type}`;
        const currentValue = Number(value) || 0;
        const currentTotal = result[propertyKey] || 0;
        result[propertyKey] = resultTransformFn(currentTotal + currentValue, subjectName);
    });

    return result;
};

class UploadResultService {
    constructor() {
        this.userDao = new UserDao();
        this.resultDao = new ResultDao();
    }

    /**
     * Create a user
     * @param {Object} userBody
     * @returns {Object}
     */
    async uploadResult(file) {
        try {
            // const workbook = xlsx.readFile(file.path);

            // Get the first worksheet in the workbook
            // const worksheet = workbook.Sheets[workbook.SheetNames[0]];

            const excelData = excelToJson({
                sourceFile: file.path,
                sheets: [
                    {
                        name: 'markSheet',
                        header: {
                            rows: 3,
                        },
                        columnToKey: {
                            A: 'roll',
                            B: 'name',
                            C: 'bangla_1st_CQ',
                            D: 'bangla_1st_MCQ',
                            E: 'bangla_2nd_CQ',
                            F: 'bangla_2nd_MCQ',
                            G: 'english_1st_CQ',
                            H: 'english_2nd_CQ',
                            I: 'ICT',
                            J: 'optional',
                        },
                    },
                ],
            });
            console.log(excelData, 'excelData');

            // Define the subjects for which you want to calculate totals
            // console.log(excelData);

            const values = excelData.markSheet.map((markSheet) => {
                const { roll, name, optional, ...subjects } = markSheet;
                const subjectTotal = calculateSubjectNumbers(
                    subjects,
                    true,
                    '_total',
                    calculateSubjectTotal,
                );
                const eachSubjectTotal = calculateSubjectNumbers(
                    subjectTotal,
                    false,
                    '_total',
                    calculateSubjectTotal,
                );
                const subjectPercentages = calculateSubjectNumbers(
                    eachSubjectTotal,
                    false,
                    '_percentage',
                    calculateSubjectPercentage,
                );
                const subjectGradePoints = calculateSubjectNumbers(
                    subjectPercentages,
                    false,
                    '_GP',
                    calculateGradePoint,
                );

                const totalMarks = calculateTotalMarks(subjects);
                const totalGradePoint = calculateTotalGradePoint(subjectGradePoints);
                const GPA = calculateGPA(
                    totalGradePoint,
                    subjectGradePoints,
                    subjectTotal,
                    optional,
                );
                const totalFailed = getTotalFailedSubjects(subjectTotal);

                return {
                    subjectNumbers: { name, roll, ...subjects },
                    subjectCalculation: {
                        roll,
                        name,
                        ...subjectTotal,
                        ...subjectPercentages,
                        ...subjectGradePoints,
                        totalMarks,
                        totalGradePoint,
                        GPA,
                        totalFailed,
                        ...eachSubjectTotal,
                    },
                };
            });

            const subjectNumbers = values.map((value) => {
                return value.subjectNumbers;
            });
            const subjectCalculation = values.map((value) => {
                return value.subjectCalculation;
            });
            const records = [];

            subjectNumbers.forEach((result) => {
                const { name, roll } = result;
                Object.entries(result).forEach(([key, value]) => {
                    if (key !== 'name' && key !== 'roll') {
                        records.push({
                            name,
                            roll,
                            subjectName: key,
                            score: value,
                        });
                    }
                });
            });
console.log(records, "records");
            // console.log(subjectNumbers, subjectCalculation);

            // Insert the mapped data into the database using the sequelize library
            await this.resultDao.uploadBulkResult(records);

            return responseHandler.returnSuccess(httpStatus.CREATED, subjectNumbers);
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Something went wrong!');
        }
    }
}

module.exports = UploadResultService;
