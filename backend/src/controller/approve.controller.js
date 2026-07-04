import leavemodel from "../model/leave.model.js";
import payrollmodel from '../model/payroll.model.js'
import attendmodel from "../model/attend.model.js";
import usermodel from "../model/user.model.js";

export async function leaveList(req, res) {
    try {

        if (req.user.role !== "admin") {
            return res.status(403).json({
                message: "Access Denied"
            })
        }

        const leaves = await leavemodel
            .find()
            .populate("user", "name email department")

        res.status(200).json({
            message: "Leave List",
            leaves
        })

    }
    catch (err) {
        console.log(err)

        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}
export async function approveLeave(req, res) {

    try {

        if (req.user.role !== "admin") {
            return res.status(403).json({
                message: "Access Denied"
            })
        }

        const { id } = req.params

        const leave = await leavemodel.findByIdAndUpdate(
            id,
            {
                status: "approved"
            },
            {
                new: true
            }
        )

        if (!leave) {
            return res.status(404).json({
                message: "Leave Not Found"
            })
        }

        res.status(200).json({
            message: "Leave Approved",
            leave
        })

    }
    catch (err) {

        console.log(err)

        return res.status(500).json({
            message: "Internal Server Error"
        })

    }

}
export async function rejectLeave(req, res) {

    try {

        if (req.user.role !== "admin") {
            return res.status(403).json({
                message: "Access Denied"
            })
        }

        const { id } = req.params

        const leave = await leavemodel.findByIdAndUpdate(
            id,
            {
                status: "rejected"
            },
            {
                new: true
            }
        )

        if (!leave) {

            return res.status(404).json({
                message: "Leave Not Found"
            })

        }

        res.status(200).json({
            message: "Leave Rejected",
            leave
        })

    }
    catch (err) {

        console.log(err)

        return res.status(500).json({
            message: "Internal Server Error"
        })

    }

}
export async function payrollList(req, res) {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({
                message: "Access Denied"
            });
        }

       
        const payroll = await usermodel.find({}, "name email department salary");

        res.status(200).json({
            payroll
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}
export async function attendanceList(req, res) {

    try {

        if (req.user.role !== "admin") {

            return res.status(403).json({
                message: "Access Denied"
            })

        }

        const attendance = await attendmodel
            .find()
            .populate("user", "name email")

        res.status(200).json({
            attendance
        })

    }
    catch (err) {

        console.log(err)

        return res.status(500).json({
            message: "Internal Server Error"
        })

    }

}

