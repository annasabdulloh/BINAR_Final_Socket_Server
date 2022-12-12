const { Notifications } = require('./models');

let onlineUsers = [];

const addNewUser = (userId, socketId) => {
    !onlineUsers.some((user) => user.userId === userId) &&
        onlineUsers.push({ userId, socketId });
};

const removeUser = (socketId) => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
    return onlineUsers.find((user) => user.userId === userId);
};

const getNOtify = async (userId, id = null) => {
    let notifications = undefined
    if (id != null) {
        notifications = await Notifications.findAll({
            where: {
                id: id
            }
        })
        return notifications
    } else {
        notifications = await Notifications.findAll({
            where: {
                user_id: userId
            }
        })
        return notifications
    }
}

module.exports = {
    async setNotify(req, res) {
        // let userId = await getNOtify(null, req.params.id)
        try {
            let notification = await getNOtify(null, req.params.id)
            console.log(notification[0].user_id, req.params.id);
            let userOnline = getUser(notification[0].user_id)
            if (userOnline != undefined) {
                global.io.to(userOnline.socketId).emit("notify", notification[0].notification)
            }
        } catch (error) {
            console.log(error);
        }
        res.status(200).json({
            status: "OK",
            message: "Norify has emited",
        });
    },
    async setFirstNotify(userId, socketId) {
        // console.log(getUser('rgffhguhr -yegfyef-2'));
        try {
            let notifications = await getNOtify(userId)
            for (let i = 0; i < notifications.length; i++) {
                global.io.to(socketId).emit("notify", notifications[i].notification)
            }
        } catch (error) {
            console.log(error);
        }
    },
    addNewUser,
    removeUser,
    getUser
}