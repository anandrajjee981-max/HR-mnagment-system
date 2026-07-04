import Attendance from '../model/attend.model.js'


export async function checkIn (req, res){
    try {

        const today = new Date().toISOString().split("T")[0];

        const alreadyMarked = await Attendance.findOne({
            user: req.user.id,
            date: today
        });

        if (alreadyMarked) {
            return res.status(400).json({
                success: false,
                message: "Already Checked In"
            });
        }

        const attendance = await Attendance.create({
            user: req.user.id
        });

        res.status(201).json({
            success: true,
            message: "Check In Successful",
            attendance
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

export async function checkOut (req, res){

    try {

        const today = new Date().toISOString().split("T")[0];

        const attendance = await Attendance.findOne({
            user: req.user.id,
            date: today
        });

        if (!attendance) {

            return res.status(404).json({
                success: false,
                message: "Check In First"
            });

        }

        if (attendance.exittime) {

            return res.status(400).json({
                success: false,
                message: "Already Checked Out"
            });

        }

        attendance.exittime = new Date();

        attendance.status = "OUTSIDE";

        attendance.duration = Math.floor(
            (attendance.exittime - attendance.entrytime) / (1000 * 60)
        );

        await attendance.save();

        res.status(200).json({
            success: true,
            message: "Check Out Successful",
            attendance
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

export async function getAttendance (req, res){

    try {

        const attendance = await Attendance.find({
            user: req.user.id
        }).sort({
            createdAt: -1
        });

        res.status(200).json({
            success: true,
            attendance
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};








