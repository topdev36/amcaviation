import { IsArray } from 'class-validator';

export class DeleteContractsDto {
    @IsArray()
    readonly quote_ids: [];
}