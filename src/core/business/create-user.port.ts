import {Command} from "../command.js";
import {User} from "../../domain/user.js";


export abstract class CreateUserPort extends Command<Promise<User>> {
}