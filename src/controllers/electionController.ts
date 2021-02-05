import { getRepository, Request, Response, RouteParams } from "../deps.ts";

import { Election, ElectionStatus } from "../models/Election.ts";

export default class ElectionController {
  async getAllElections({ response }: { response: Response }) {
    try {
      const elections: Election[] | undefined = await getRepository(Election)
        .find();

      response.status = 200;
      response.body = {
        success: true,
        data: elections,
      };
    } catch (error) {
      console.error(error);
    }
  }

  async createElection(
    { request, response }: { request: Request; response: Response },
  ) {
    if (!request.hasBody) {
      response.status = 400;
      response.body = {
        success: false,
        errorMessage: "No data",
      };
      return;
    }

    try {
      const election = await this.getElectionFromRequest(request);
      await getRepository(Election).save(election);

      response.status = 201;
      response.body = {
        success: true,
        data: election,
      };
    } catch (error) {
      console.error(error);
    }
  }

  async updateElectionById(
    { request, response }: { request: Request; response: Response },
  ) {
    if (!request.hasBody) {
      response.status = 400;
      response.body = {
        success: false,
        errorMessage: "No data",
      };
      return;
    }

    const election = await this.getElectionFromRequest(request);

    await getRepository(Election).update(election.id, election);

    response.status = 201;
    response.body = {
      success: true,
      data: election,
    };
  }

  async deleteElectionById(
    { request, response, params }: {
      request: Request;
      response: Response;
      params: RouteParams;
    },
  ) {
    const id = params.id;

    if (!id) {
      response.status = 400;
      response.body = {
        success: false,
        errorMessage: `ID not found`,
      };
      return;
    }

    const election = await getRepository(Election).findOneOrFail(id);
    if (!election) {
      response.status = 400;
      response.body = {
        success: false,
        errorMessage: `Election with id:${id} not found`,
      };
      return;
    }

    await getRepository(Election).remove(election);

    response.status = 200;
    response.body = {
      success: true,
      message: `Election with id:"${id}" was removed`,
    };
  }

  async getElectionFromRequest(request: Request): Promise<Election> {
    const requestBody = request.body({ type: "json" });

    const values = await requestBody.value;
    const {
      id,
      title,
      description,
      status,
      eligibleVoters,
      ...nullables
    } = values;

    const election: Election = new Election();
    if (id) {
      election.id = id;
    }

    // Take all nullable values and check that they are set, if not set them to null
    // deno-lint-ignore no-explicit-any
    nullables.forEach((nullable: any, i: number) => {
      nullables[i] = this.validateNullable(nullable);
    });

    // Getting the nullable values
    const { password, isLocked, isAutomatic, openDate, closeDate } = nullables;

    election.title = title;
    election.description = description;
    election.isAutomatic = isAutomatic;
    election.isLocked = isLocked;
    election.openDate = openDate;
    election.closeDate = closeDate;
    election.password = password;
    election.status = status;

    console.log(election);
    return election;
  }

  /**
   * Check if a value is valid, if not set it to null
   * @param nullable A value that can be of type T or null
   */
  validateNullable<T>(nullable: T | null): T | null {
    if (!nullable) {
      nullable = null;
    }
    return nullable;
  }
}
