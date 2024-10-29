import FooterPage from "@/components/native/footer"
import Header from "@/components/native/nav/navbar"
import React, { Fragment } from "react"
import ChatBubble from "@/components/chat/chat-bubble"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Fragment>
      <Header />
      <div className="px-[1.4rem] md:px-[4rem] lg:px-[6rem] xl:px-[8rem] 2xl:px-[12rem]">
        {children}
        <ChatBubble />
      </div>
      <FooterPage />
    </Fragment>
  )
}
