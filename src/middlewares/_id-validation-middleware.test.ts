import {IdValidation} from "./_id-validation-middleware";
import {Request, Response} from "express";

jest.setTimeout(60_0000)
describe("test for acccces attempts", () => {
    const idValidation = new IdValidation()

    describe("test for  _id Validation", () => {
        it("should return 404", async () => {
            const reqForTest: Partial<Request> = {params: {id: "32134224"}}
            let status: number = 0
            const resForTest: Partial<Response> = {
                status: (s: number) => {
                    status = s
                    const resT: Partial<Response> = {
                        json: () => ({} as Response)
                    }
                    return resT as Response
                }
            }

            await idValidation.idMiddlewaresValidation(reqForTest as Request, resForTest as Response, () => {
            })

            expect(status).toEqual(404)
        });

        it("should return 0 ", async () => {
            const reqForTest: Partial<Request> = {params: {id: "62ed67b5bbf342ea571a0ea9"}}
            let status: number = 0
            const resForTest: Partial<Response> = {
                status: (s: number) => {
                    status = s
                    const resT: Partial<Response> = {
                        json: () => ({} as Response)
                    }
                    return resT as Response
                }
            }

            await idValidation.idMiddlewaresValidation(reqForTest as Request, resForTest as Response, () => {
            })

            expect(status).toEqual(0)
        });


    })
})
