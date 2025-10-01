import { con } from "./connection";

export function insertMessage(
  msg: string,
  senderId: number,
  recipientId: number
) {
  con.connect((connectionErr: Error) => {
    if (connectionErr) throw connectionErr;
    let sql: string;
    let values;

    //Insert the message
    sql = "INSERT INTO messages (message,sender,receiver) VALUES (?,?,?)";
    values = [msg, senderId, recipientId];

    con.query(sql, values, (insertErr: Error, insertRes: any) => {
      if (insertErr) throw insertErr;

    });
  });
}
