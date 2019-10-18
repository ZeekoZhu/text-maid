import { Test, TestingModule } from '@nestjs/testing';
import { MarkdownService } from './markdown.service';
import fs from 'fs';
import { defaultRenderOpt } from '../text-transformer';

const readFile = (path: string) => {
    return fs.readFileSync(path, { encoding: 'utf8', flag: 'r' });
};

const readTestCase = (name: string) => {
    return readFile(`test-cases/${name}.md`);
};

describe('MarkdownService', () => {
    let service: MarkdownService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [MarkdownService],
        }).compile();

        service = module.get(MarkdownService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should render [toc]', () => {
        const output = service.render(readTestCase('toc'));
        expect(output).toMatchSnapshot();
    });

    it('should render link', () => {
        const output = service.render('github.com');
        expect(output).toMatchSnapshot();
    });

    it('should render hard line break', () => {
        expect(service.render('hello\nworld')).toMatchSnapshot();
    });

    it('should render code with "<"', () => {
        expect(service.render(readTestCase('less-than'))).toMatchSnapshot();
    });

    it('should render encoded html', () => {
        expect(service.render(readTestCase('encoded-html'))).toMatchSnapshot();
    });

    it('should not width attr on table', () => {
        const output = service.render(readTestCase('table-width'));
        expect(output.html.indexOf('width')).toBeLessThan(0);
        expect(output).toMatchSnapshot();
    });

    it('should render simple math', () => {
        expect(service.render(readTestCase('math'), { ...defaultRenderOpt, math: false })).toMatchSnapshot();
    });

    it('should render math to html', () => {
        expect(service.render(readTestCase('math'))).toMatchSnapshot();
    });
});
