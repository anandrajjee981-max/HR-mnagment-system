import payrollModel from "../model/payroll.model.js";

export async function mySalary(req, res) {
  try {
    const user = req.user.id;

    const salary = await payrollModel.findOne({ user });

    if (!salary) {
      return res.status(404).json({
        message: "Salary not found",
      });
    }

    res.status(200).json({
      salary,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}