import { con } from "./connection";

export function insertMessage(msg: string, sender: string, recipient: string) {
  con.connect((connectionErr: Error) => {
    if (connectionErr) throw connectionErr;
    let sql: string;
    let values;
    //Get the id of the sender
    sql = "SELECT id FROM users WHERE username = ?";
    values = sender;
    //TODO maybe use the id directly instead of querying the username
    con.query(sql, [values], (senderErr: Error, senderRes: any) => {
      if (senderErr) throw senderErr;
      //Get the id of the receiver
      values = recipient;
      con.query(sql, [values], (recipientErr: Error, recipientRes: any) => {
        if (recipientErr) throw recipientErr;

        //Insert the message
        sql = "INSERT INTO messages (message,sender,receiver) VALUES (?,?,?)";
        values = [msg, senderRes[0].id, recipientRes[0].id];

        con.query(sql, values, (insertErr: Error, insertRes: any) => {
          if (insertErr) throw insertErr;
          console.log(insertRes);
        });
      });
    });
  });
}
