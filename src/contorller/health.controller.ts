import { HealthCheck, HealthCheckService, MemoryHealthIndicator } from '@nestjs/terminus';
import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
    constructor(
        private health: HealthCheckService,
        private memory: MemoryHealthIndicator,
    ) { }

    @Get()
    @HealthCheck()
    healthCheck() {
        return this.health.check([
            async () => this.memory.checkHeap('memory_heap', 600 * 1024 * 1024),
        ]);
    }
}
