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

    @Get('githubCommits')
    async getGithubCommits(@Query('per_page') per_page: number, @Query('page') page: number) {
        const frontCommits = await firstValueFrom(
            this.httpService.get(
                `${this.config.githubApiBaseUrl}/${this.config.githubOwner}/${this.config.githubRepo}/commits?per_page=${per_page}&page=${page}`
            )
        );
        const backCommits = await firstValueFrom(
            this.httpService.get(
                `${this.config.githubApiBaseUrl}/${this.config.githubOwner}/blog-server/commits?per_page=${per_page}&page=${page}`
            )
        );
        const commits = [...frontCommits.data, ...backCommits.data]
            .map((item) => ({
                ...item,
                // 判断是前端还是后端
                tag: item.html_url.includes(this.config.githubRepo) ? '1' : '2'
            }))
            .sort((a, b) => new Date(b.commit.author.date).getTime() - new Date(a.commit.author.date).getTime());
        return commits;
    }
}
