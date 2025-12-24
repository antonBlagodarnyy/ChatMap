import axios from "axios";

async function parseUserIds(ids: Set<number>, token: string) {
  if (token) {
    const castedIds = [...ids];

    if (castedIds.length != 0) {
      try {
        const sendersUsernamesRes = await axios.get<{
          usernames: Record<number, string>;
        }>(`${process.env.PROFILE_URL}/profile/usernamesById`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          params: {
            usersIds: castedIds,
          },
        });

        return sendersUsernamesRes.data.usernames;
      } catch (err: any) {
        console.error(`[parseMessages -> parseSendersAndReceivers()] `, err);
        //If failed, return an error
        throw err;
      }
    }
  }
}

export default parseUserIds;
