import { FC, ReactNode } from "react";

import { Card } from "@/components/ui/card";

interface IAuthContainerProps {
  sideText: string
  children: ReactNode
  childrenSide: 'left' | 'right'
};

export const AuthContainer: FC<IAuthContainerProps> = ({
  sideText,
  children,
  childrenSide
}) => (
  <div className="flex justify-center items-center min-h-[100vh]">
    <Card className="flex shadow-none sm:w-[900px] md:w-[1200px] h-[400px] px-10 border-none ">
      {childrenSide === 'left' && <ChildrenLeft>{children}</ChildrenLeft>}
      <OtherSideText text={sideText} />
      {childrenSide === 'right' && <ChildrenRight>{children}</ChildrenRight>}
    </Card>
  </div>
)

const ChildrenRight = ({ children }: { children: ReactNode }) => (
  <>
    <Divider />
    <Content>{children}</Content>
  </>
)

const ChildrenLeft = ({ children }: { children: ReactNode }) => (
  <>
    <Content>{children}</Content>
    <Divider />
  </>
)

const OtherSideText = ({ text }: { text: string }) => (
  <div className="rounded-lg hidden sm:flex justify-center items-center w-[50%] bg-slate-700 text-4xl">
    <span className="text-semibold text-white">
      {text}
    </span>
  </div>
)

const Content = ({ children }: { children: ReactNode }) => (
  <div className="flex flex-col gap-3 w-[100%] sm:w-[50%] py-20">
    <div className="font-semibold text-slate-800">Enter with your data</div>
    {children}
  </div>
)


const Divider = () => (
  <div className="hidden sm:block border-x-[1px] mt-8 mb-8 ms-4 me-4 border-x-slate-300">
  </div>
)