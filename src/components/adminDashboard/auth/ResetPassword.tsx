"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const ResetPassword = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>SignIn</CardTitle>
      </CardHeader>
      <form>
        <CardContent className="space-y-2">
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Enter Email" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" />
          </div>
          <Button
            type="button"
            className="bg-transparent border-none text-black w-[350px]"
          >
            Forget Password
          </Button>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-[350px]">
            Reset Password
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ResetPassword;
