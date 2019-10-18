import {
    TerminusEndpoint,
    TerminusOptionsFactory,
    TerminusModuleOptions,
    MemoryHealthIndicator,
} from '@nestjs/terminus';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TerminusOptionsService implements TerminusOptionsFactory {
    constructor(private readonly memory: MemoryHealthIndicator) {
    }

    createTerminusOptions(): TerminusModuleOptions {
        const healthEndpoint: TerminusEndpoint = {
            url: '/health',
            healthIndicators: [async () => this.memory.checkHeap('memory_heap', 600 * 1024 * 1024)],
        };
        return { endpoints: [healthEndpoint] };
    }
}
