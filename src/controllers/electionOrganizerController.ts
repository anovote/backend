import { ElectionOrganizer } from "../models/electionOrganizer.ts";
import { bcrypt } from "../deps.ts";

export default {
  createElectionOrganizer: createElectionOrganizer,
  getElectionOrganizerById: () => {},
};

async function createElectionOrganizer(
  { request, response }: { request: any; response: any },
) {
  if (request.hasBody) {
    const registerElectionOrganizer: ElectionOrganizer = await request.body()
      .value;
    const hashedPassword = hashPassword(registerElectionOrganizer.password);
    console.log(
      compareHashWithPassword(
        registerElectionOrganizer.password,
        hashedPassword,
      ),
    );
    response.status = 201;
    response.body = {
      success: true,
      msg: "Election organizer created!",
    };
  } else if (!request.hasBody) {
    response.status = 400;
    response.body = {
      success: false,
      msg: "No data",
    };
    return;
  }
}

async function hashPassword(passwordToHash: string): Promise<string> {
  return await bcrypt.hash(passwordToHash);
}

async function compareHashWithPassword(
  password: string,
  hash: Promise<string>,
): Promise<boolean> {
  const stringHash = (await hash).toString();
  return await bcrypt.compare(password, stringHash);
}
