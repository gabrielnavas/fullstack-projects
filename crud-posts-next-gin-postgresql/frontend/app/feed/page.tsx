"use client"

import { FC } from "react"

import { FeedContextProvider } from "@/contexts/feed-context"

import { Header } from "@/components/header"
import { Feed } from "@/components/feed/feed"

const FeedPage: FC = () => {

  return (
    <FeedContextProvider>
      <div>
        <Header />
        <Feed />
      </div>
    </FeedContextProvider>
  )
}

export default FeedPage