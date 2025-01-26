import pkg, { type QueryResultRow } from "pg";
import path from "path";
import { useLogger } from "~/composables/useLogger";

/**
 * Creates a new PostgreSQL database connection with robust configuration
 **/
export type QueryArgs = string | number | boolean | null | Date;

export function usePg() {
  const { logError, logInfo } = useLogger();
  try {
    // Instantiate PostgreSQL client with comprehensive connection configuration
    const client = new pkg.Client({
      host: process.env.PG_HOST, // Database server address
      port: Number(process.env.PG_PORT), // Explicitly convert port to number
      user: process.env.PG_USER, // Authentication username
      password: process.env.PG_PASSWORD, // Authentication password
      database: process.env.PG_DATABASE, // Target database name
      ssl: {
        rejectUnauthorized: false, // Allow self-signed or untrusted certificates
        ca: path.resolve(process.cwd(), "eu-north-1-bundle.pem"), // Load SSL certificate authority
      },
    });

    /**
     * Executes a SQL query with optional arguments and logs metadata
     */
    const query = async <T extends QueryResultRow>({
      sqlQuery,
      sqlQueryArgs,
      meta,
    }: {
      sqlQuery: string;
      sqlQueryArgs?: QueryArgs[];
      meta?: { operation: string; entity: string };
    }): Promise<pkg.QueryResult<T>> => {
      try {
        client.connect(); // Connect to the database
        logInfo(
          `Executing ${meta?.operation || "operation"} on ${meta?.entity || "entity"
          }`
        );
        const result = await client.query(sqlQuery, sqlQueryArgs || []);
        return result;
      } catch (error) {
        logError(`Error executing query: ${error}`);
        throw error;
      } finally {
        client.end();
      }
    };

    return { client, query };
  } catch (error) {
    logError(error);
    throw error;
  }
}