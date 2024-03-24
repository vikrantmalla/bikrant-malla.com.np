"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { setShowForgetPasswordModal } from "@/redux/feature/appSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { joseFont } from "@/helpers/lib/font";

const ResetPassword = () => {
  const dispatch = useDispatch<AppDispatch>();
  const handleClick = () => {
    dispatch(setShowForgetPasswordModal(false));
  };
  return (
      <Tabs defaultValue="Reset Password" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="Reset Password" className={`${joseFont} fs-400`}>
            Forget Password
          </TabsTrigger>
        </TabsList>
        <TabsContent value="Reset Password">
          <Card>
            <CardHeader>
              <button onClick={() => handleClick()}>Back</button>
              <CardTitle className={`${joseFont} fs-400`}>
                Forget Password
              </CardTitle>
            </CardHeader>
            <form>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="email" className={`${joseFont} fs-400`}>
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter Email"
                    className={`${joseFont} fs-400`}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password" className={`${joseFont} fs-400`}>
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter Password"
                    className={`${joseFont} fs-400`}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  className={`${joseFont} fs-400 w-[350px]`}
                >
                  Reset Password
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
  );
};

export default ResetPassword;
