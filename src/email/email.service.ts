import { Injectable } from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import {generateVerificationEmailTemplate} from './templates/email-verification.template'

const nodeMailjet = require('node-mailjet');

@Injectable()
export class EmailService {
    private mailjet;
    constructor(private configService: ConfigService) {
        this.mailjet = nodeMailjet.apiConnect(
            `${this.configService.get<string>('MJ_APIKEY_PUBLIC')}`,
            `${this.configService.get<string>('MJ_APIKEY_PRIVATE')}`,
        );
    }
    async sendVerificationMail(payload: {
        email: string;
        fullName: string;
        verificationLink: string;
    }) {
        const { email, fullName, verificationLink } = payload;

        try {
            const htmlContent = generateVerificationEmailTemplate({
                fullName,
                verificationLink,
            });

            const payload = {
                From: {
                    Email: this.configService.get<string>('MJ_SENDER_EMAIL'),
                    Name: this.configService.get<string>('MJ_SENDER_NAME'),
                },
                To: [{Email: email}],
                Subject: 'Verify Your Email Address',
                HTMLPart: htmlContent,
            };

            try {
                await this.mailjet.post('send', { version: 'v3.1' }).request({
                    Messages: [payload]
                });
            } catch (err) {
                console.log(err)
            }

        } catch (error) {
            throw new Error('Failed to send email');
        }
    }
}
