// import { EntityManager } from "https://denolib.com/denolib/typeorm@v0.2.23-rc10/src/entity-manager/EntityManager.ts";
import {
  // getManager,
  getRepository,
} from "https://denolib.com/denolib/typeorm@v0.2.23-rc10/src/index.ts";
import { Response } from "https://deno.land/x/oak@v6.5.0/response.ts";
// import { getRepository } from "https://denolib.com/denolib/typeorm@v0.2.23-rc10/src/index.ts";

import { Election } from "../models/Election.ts";

export default class ElectionController {
  // entityManager: EntityManager = getManager();

  async getAllElections({ response }: { response: Response }) {
    console.log("get to function");

    try {
      const elections: Election[] | undefined =
        // await undefined;
        await getRepository(Election)
          .find();
      // await getRepository(
      //   Election,
      // )
      //   .findOne(1);
      response.body = {
        success: true,
        data: elections,
      };
    } catch (error) {
      console.error(error);
    }
  }
}

// import { Election } from "../models/Election.ts";
// import {} from "../deps.ts";
// import { Response } from "https://deno.land/x/oak@v6.5.0/response.ts";
// import { Request } from "https://deno.land/x/oak@v6.5.0/request.ts";

// export default {
//   /**
//    * TODO: add comment
//    */
//   getAllElections: getAllElections,
//   createElection: createElection,
//   getElectionById: () => {},
//   updateElectionById: () => {},
//   deleteElectionById: () => {},
// };

// function getAllElections(
//   { response }: { response: Response },
// ) {
//   await Election.get;
//   response.status = 200;
//   response.body = {
//     success: true,
//     data: elections,
//   };
// }

// async function createElection(
//   { request, response }: {
//     request: Request;
//     response: Response;
//   },
// ) {
//   console.log("Create user");

//   if (!request.hasBody) {
//     response.status = 400;
//     response.body = {
//       success: false,
//       msg: "No data",
//     };
//     return;
//   }

//   const electionData = await request.body().value as Election;
//   console.log(electionData);

//   const [error, election] = validator(electionData);
//   console.log(election);

//   console.log(error?.message);

//   // validateElectionData(electionData);
// }

// function getElectionById({ response }: { response: any }) {
// }
