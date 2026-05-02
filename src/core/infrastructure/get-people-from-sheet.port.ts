import {Command} from "../command.js";
import {PeopleModel} from "../../domain/people.js";


export abstract class GetPeopleFromSheetPort extends Command<Promise<PeopleModel[]>> {
}