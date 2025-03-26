export type User = {
    id?: string,
    firstName?: string,
    lastName?: string,
    username?: string,
    password?: string,
    email?: string,
    phoneNumber?: string
}

export enum FieldUser {
    FirstName = "firstName",
    LastName = "lastName",
    Username = "username",
    Password = "password",
    Email = "email",
    PhoneNumber = "phoneNumber",
}