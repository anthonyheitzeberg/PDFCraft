import { ClassSerializerInterceptor, Controller, Get, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { OrgService } from './org.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Org } from './org.entity';
import { Response } from 'express';
import fs from 'fs';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { GetOrg } from './get-org.decorator';

@ApiTags('Organization')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth('jwt')
@Controller('org')
export class OrgController {
  constructor(private readonly orgService: OrgService) {}

  @Get('pdf')
  @ApiOperation({ summary: 'Mail Reports' })
    async generatePdf(@GetOrg() org: Org, @Res() res: Response) {
        let filePath: any;
        try {
            filePath = await this.orgService.createPdfInOneFile("id=1");

            res.setHeader('Content-disposition', 'attachment; filename=output.pdf');
            res.setHeader('Content-type', 'application/pdf');

            res.sendFile(filePath, { root: process.cwd() }, (err) => {
                if (err) {
                    console.error(err);
                }
                fs.unlinkSync(filePath); // Remove the temporary PDF file
            });
        } catch (err) {
            console.log('Error generating PDF:', err);
            throw err;
        }
    }
}

