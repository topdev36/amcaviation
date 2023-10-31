import { IsString, IsArray } from 'class-validator';

export class GeneratePayLinkDto {
    @IsString()
    readonly quote_id: string;
    @IsString()
    readonly creation: string;
    @IsString()
    readonly date: string;
    @IsString()
    readonly email: string;
    @IsString()
    readonly aircraft: string;
    @IsString()
    readonly file: string;    
    @IsString()
    readonly sum: number;
    @IsArray()
    readonly txs: [];
}