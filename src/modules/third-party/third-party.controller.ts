import appConfig from '@/config/app';
import { HttpService } from '@nestjs/axios';
import { Controller, Get, Inject, Ip, Param, Query } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Controller('thirdParty')
export class ThirdPartyController {
    @Inject(HttpService)
    private httpService: HttpService;
    @Inject(appConfig.KEY)
    private readonly config: ConfigType<typeof appConfig>;

    @Get('weather')
    async getWeather() {
        const location = await firstValueFrom(
            this.httpService.get(`https://restapi.amap.com/v3/ip?key=${this.config.amapKey}`)
        );
        const weatherInfo = await firstValueFrom(
            this.httpService.get(
                `https://restapi.amap.com/v3/weather/weatherInfo?key=${this.config.amapKey}&city=${location.data.city}`
            )
        );
        return weatherInfo.data.lives[0];
    }
}
