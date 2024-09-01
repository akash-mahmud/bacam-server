import { server } from "@/server";
import assert from "assert";
it("run a health check aginst our schema", async() => {
const responsce = await (await server()).executeOperation({
    query:`query HealthCheckQuery {
        healthCheck
      }`
})
assert(responsce.body.kind === 'single');

expect(responsce).toBeTruthy()
expect(responsce.body.singleResult.errors).toBeUndefined();
expect(responsce.body.singleResult).toHaveProperty('data')
expect(responsce.body.singleResult.data?.healthCheck).toBe('Everything is fine.😎');

});
