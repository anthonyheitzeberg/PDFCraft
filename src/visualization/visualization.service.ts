import { Injectable } from '@nestjs/common';
import { createCanvas } from 'canvas';
import * as echarts from 'echarts';
import puppeteer from 'puppeteer';

@Injectable()
export class VisualizationService {
  // Currently I am not using any data to generate chart just harcoded values.
  async createChart(data?): Promise<Buffer> {
    const echartOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
        },
      ],
      series: [
        {
          name: 'Direct',
          type: 'bar',
          barWidth: '60%',
          data: [10, 52, 200, 334, 390, 330, 220],
        },
      ],
    };

    const canvas = createCanvas(600, 600);
    const chart = echarts.init(canvas as any);

    chart.setOption(echartOption);

    return canvas.toBuffer('image/png');
  }
}