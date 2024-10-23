import { Injectable } from '@nestjs/common';
import jsPDF from 'jspdf';
import { index, TableOptions, TextOptions } from './pdf.interface';
import autoTable from 'jspdf-autotable';

@Injectable()
export class PdfService {
    private doc: jsPDF;
    private readonly filePath = './output.pdf';
    private readonly xMargin = 20;
    private readonly yMargin = 30;
    private indexData: index[] = [];
    private x: number;
    private y: number;

    private defaultTableOptions: TableOptions = {
        tableName: 'default table name',
        ignoreFields: [],
        addToIndex: false
    }

    constructor() {
        this.doc = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });
        this.resetXAndY();
        this.updatePointer();
    }

    private resetXAndY() {
        this.x = this.xMargin
        this.y = this.yMargin
    }

    private updatePointer() {
        this.doc.moveTo(this.x, this.y);
    }

    async addNewPage() {
        this.doc.addPage();
        this.resetXAndY()
        this.updatePointer()
    }

    // Adds an image at position (x, y) with width and height
    async addImage(imageData: Buffer, options?: any) {
        this.doc.addImage(
            imageData,
            'JPEG',
            options?.x || this.x,
            options?.y || this.y,
            options?.width || this.doc.internal.pageSize.getWidth(),
            options?.height || this.doc.internal.pageSize.getHeight()
        );

        this.y = options?.height || this.doc.internal.pageSize.getHeight() + this.doc.getLineHeight();
        this.updatePointer();
    }

    async addGenericTable<T>(dataArr: T[], options: TableOptions) {
        if (dataArr.length === 0) {
            console.error('Data array is empty')
            return
        }

        const mergeOptions: TableOptions = {
            ...this.defaultTableOptions,
            ...options,
            startY: this.y + this.doc.getLineHeight()
        }

        this.addText(`${mergeOptions.tableName}`);

        if (mergeOptions.addToIndex) {
            this.indexData.push({
                Index: mergeOptions.tableName,
                Page: this.doc.getCurrentPageInfo().pageNumber,
            });
        }

        const headers = Object.keys(dataArr[0]).filter(
            (key) => !mergeOptions.ignoreFields?.includes(key),
        );

        const transformedData = dataArr.map((item: any, index) =>
            headers.map((key : string) =>
                item[key] instanceof Date ? item[key].toISOString() : item[key],
            ),
        );

        autoTable(this.doc, {
            head: [headers],
            body: transformedData,
            didDrawCell: (data) => {},
            ...mergeOptions,
        });
        this.y = (this.doc as any).lastAutoTable.finalY + this.doc.getLineHeight();
        this.updatePointer();
    }

    async addText(text: string, options?: TextOptions) {
        const lines = this.doc.splitTextToSize(
            text,
            this.doc.internal.pageSize.width - this.xMargin * 2,
        );

        if (options?.addToIndex) {
            this.indexData.push({
                Index: text,
                Page: this.doc.getCurrentPageInfo().pageNumber,
            })
        }

        console.log(`posi before writing TEXT '${text}' is ${this.x} & ${this.y}`)
        this.doc.text(
            lines,
            options?.x || this.x,
            options?.y || this.y
        );
        this.y = this.doc.getTextDimensions(lines).h + this.doc.getLineHeight();
        this.updatePointer()
    }

    async addNewLine() {
        this.y += this.doc.getLineHeight();
        this.x = this.xMargin;
        this.updatePointer();
    }

    async render(): Promise<string> {
        await this.addPageNumbers();
        await this.index();
        return new Promise<string>((resolve, reject) => {
            this.doc.save(this.filePath);
            resolve(this.filePath);
        })
    }

    private async addPageNumbers() {
        const pageCount = (this.doc as any).internal.getNumberOfPages(); // Total Page Number
        for (let i = 0; i < pageCount; i++) {
            this.doc.setPage(i);
            const pageCurrent = (this.doc as any).internal.getCurrentPageInfo().pageNumber;
            this.doc.text(
                'page: ' + pageCurrent + '/' + pageCount,
                this.xMargin,
                this.doc.internal.pageSize.height - this.yMargin/2
            );
        }
    }

    private async index() {
        this.doc.setPage(2);
        this.resetXAndY();
        this.updatePointer();
        await this.addGenericTable(this.indexData, {
            tableName: "Table of Contents",
            theme: 'grid'
        })
    }
}
