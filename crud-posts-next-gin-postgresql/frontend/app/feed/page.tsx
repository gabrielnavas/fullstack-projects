"use client"

import { FC } from "react";

import { Header } from "@/components/header";
import { FeedContextProvider } from "../../contexts/feed-context";
import { Feed } from "@/components/feed/feed";

const FeedPage: FC = () => {

  return (
    <FeedContextProvider>
      <div>
        <Header />
        <Feed />
      </div>
    </FeedContextProvider>
  );
}

export default FeedPage;