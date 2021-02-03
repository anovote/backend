import { bcrypt } from "../deps.ts";
import { ElectionOrganizer } from "../models/ElectionOrganizer.ts";
import { DatabaseConnection } from "../DatabaseConnection.ts";
import { Request } from "https://deno.land/x/oak@v6.5.0/request.ts";
import { Response } from "https://deno.land/x/oak@v6.5.0/response.ts";

export default {
  createElectionOrganizer: createElectionOrganizer,
  getElectionOrganizerById: () => {},
};

async function createElectionOrganizer(
  { request, response }: { request: Request; response: Response },
) {
  if (request.hasBody) {
    const electionOrganizer: ElectionOrganizer = await request.body().value;

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
