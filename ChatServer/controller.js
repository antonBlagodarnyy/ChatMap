"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertMessage = insertMessage;
const connection_1 = require("./connection");
function insertMessage(msg, sender, recipient) {
    connection_1.con.connect((connectionErr) => {
        if (connectionErr)
            throw connectionErr;
        let sql;
        let values;
        //Get the id of the sender
        sql = "SELECT id FROM users WHERE username = ?";
        values = sender;
        connection_1.con.query(sql, [values], (senderErr, senderRes) => {
            if (senderErr)
                throw senderErr;
            console.log(senderRes);
            //Get the id of the receiver
            values = recipient;
            connection_1.con.query(sql, [values], (recipientErr, recipientRes) => {
                if (recipientErr)
                    throw recipientErr;
                //Insert the message
                sql = "INSERT INTO messages (message,sender,receiver) VALUES (?,?,?)";
                values = [msg, senderRes[0].id, recipientRes[0].id];
                connection_1.con.query(sql, values, (insertErr, insertRes) => {
                    if (insertErr)
                        throw insertErr;
                    console.log(insertRes);
                });
            });
        });
    });
}
