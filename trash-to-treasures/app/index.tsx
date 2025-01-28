import { Redirect } from "expo-router";
import React from "react";

export default function Index() {
  // Redirect to Login Screen
  return <Redirect href="/screens/login" />;
}
