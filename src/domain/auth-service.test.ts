import "reflect-metadata";

jest.setTimeout(60_0000)
/*
describe("integration test for AuthService ", () => {
   let mongoServer: MongoMemoryServer
   beforeAll(async () => {
       mongoServer = await MongoMemoryServer.create()
       const mongoUri = mongoServer.getUri()
       await mongoose.connect(mongoUri)
   })
   afterAll(async () => {
       await mongoose.disconnect()
       await mongoServer.stop()
   })
   const userRepositories = new UserRepositories()
   const emailAdapterMock: jest.Mocked<EmailAdapter> = {
       sendEmail: jest.fn()
   }
   const emailManager = new EmailManager(emailAdapterMock)
   const userHelper = new UserHelper()
   const authService = new AuthService(userRepositories, emailManager, userHelper)

   describe("createUser", () => {
       it('should return create user ', async () => {
           const email = "ivan1223@kotyk.ru";
           const login = "Ivan";
           const password = "123";
           const result = await authService.createUser(login, email, password)

           expect(result!.accountData.email).toBe(email)
           expect(result!.accountData.login).toBe(login)
           expect(result!.emailConfirmation.isConfirmed).toBe(false)
       });
       it('this.emailManager.sendEmailConfirmationMessage should be called', async () => {
           const email = "ivan1223@kotyk.ru";
           const login = "Ivan";
           const password = "123";
           const result = await authService.createUser(login, email, password)


           expect(emailAdapterMock.sendEmail).toBeCalled()
       });
   })
   describe("confirmEmail", () => {
       it('should return false for expired confirmation code ', async () => {

           const result = await authService.confirmEmail("confirmationcode")


       });
   })




})


        */