import axios from "axios";
import axiosRetry from "axios-retry";
import { API_RETRIES } from "../constants";

// todo; remove?
axiosRetry(axios, {
  retries: API_RETRIES,
  retryDelay: axiosRetry.exponentialDelay,
});
