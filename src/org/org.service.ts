import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Org } from './org.entity';
import { PdfService } from 'src/pdf/pdf.service';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { VisualizationService } from 'src/visualization/visualization.service';

@Injectable()
export class OrgService {
    constructor(
        @InjectRepository(Org)
        private orgRepository: Repository<Org>,
        private userService: UserService,
        private pdfService: PdfService,
        private visualizationService: VisualizationService,
    ) {}

    async createPdfInOneFile(orgId: string): Promise<any> {
        // const usersData = await this.findAllUsersOfOrg(orgId);
        // Create a variable usersData that contains the data of users
        const usersData = [
            {
                id: '1',
                email: 'test.user1@email.com',
                password: 'password',
                otp: '123456',
                otpCreatedAt: new Date(),
                lastPasswordUpdateAt: new Date(),
                createdAt: new Date(),
            },
            {
                id: '2',
                email: 'test.user2@email.com',
                password: 'password',
                otp: '123456',
                otpCreatedAt: new Date(),
                lastPasswordUpdateAt: new Date(),
                createdAt: new Date(),
            }
        ];

        const chart = await this.visualizationService.createChart();
    
        await this.pdfService.addText(`Heading`);
        await this.pdfService.addNewLine(); // Leave an empty Line
        await this.pdfService.addText(`SubHeading`);
        await this.pdfService.addNewLine();
    
        //one page left empty for TOC
        await this.pdfService.addNewPage();
    
        await this.pdfService.addNewPage();
        await this.pdfService.addGenericTable(usersData, {
          ignoreFields: ['password', 'otp', 'otpCreatedAt', 'lastPasswordUpdateAt'],
          tableName: 'Users Table',
          addToIndex: true, //add to TOC
          theme: 'grid',
        });
         
        //changed ignoreFields.Table resizes automatically. Look in pdf images
        await this.pdfService.addGenericTable(usersData, {
          ignoreFields: ['password', 'otp', 'otpCreatedAt', 'lastPasswordUpdateAt', 'createdAt'],
          tableName: 'Users2 Table',
          addToIndex: true , // add to TOC
          theme: 'grid',
        });
    
        await this.pdfService.addNewPage();
        await this.pdfService.addText(`TRAILING PAGE`, {
          align: 'center',
          
        });
           this.pdfService.addImage(chart,{width : 200 ,height : 200})
        return await this.pdfService.render();
    }
}
