"use client"

import * as React from "react"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

type Direction = "horizontal" | "vertical"
type PanelGroupContext = {
  direction: Direction
  groupId: string
  panels: React.RefObject<HTMLDivElement>[]
  sizes: number[]
  setSizes: (sizes: number[]) => void
  minSizes: number[]
  collapsible: boolean[]
  collapsedSizes: number[]
}

const PanelGroupContext = React.createContext<PanelGroupContext | null>(null)

const usePanelGroup = () => {
  const context = React.useContext(PanelGroupContext)
  if (!context) {
    throw new Error("usePanelGroup must be used within a PanelGroup")
  }
  return context
}

const ResizablePanelGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    direction: Direction
    collapsible?: boolean
  }
>(
  (
    { direction, collapsible = false, className, children, ...props },
    forwardedRef
  ) => {
    const groupId = React.useId()
    const panels = React.Children.map(children, (child) =>
      React.createRef<HTMLDivElement>()
    ) as React.RefObject<HTMLDivElement>[]
    const panelElements = panels.map((p) => p.current).filter(Boolean)

    const minSizes = React.Children.map(
      children,
      (child) => (child as React.ReactElement).props.minSize ?? 0
    ) as number[]
    const collapsiblePanels = React.Children.map(
      children,
      (child) => (child as React.ReactElement).props.collapsible ?? collapsible
    ) as boolean[]
    const collapsedSizes = React.Children.map(
      children,
      (child) => (child as React.ReactElement).props.collapsedSize ?? 0
    ) as number[]

    const [sizes, setSizes] = React.useState<number[]>(() => {
      const childrenArray = React.Children.toArray(children)
      const initialSizes: number[] = childrenArray.map(
        (child: any) => child.props.defaultSize ?? 100 / childrenArray.length
      )
      const totalSize = initialSizes.reduce((a, b) => a + b, 0)
      if (totalSize !== 100) {
        // Normalize sizes if they don't add up to 100
        return initialSizes.map((size) => (size / totalSize) * 100)
      }
      return initialSizes
    })

    const onResize = React.useCallback(
      (index: number, delta: number) => {
        setSizes((prevSizes) => {
          const newSizes = [...prevSizes]
          const [firstPanelIndex, secondPanelIndex] = [index - 1, index]
          let firstPanelSize = newSizes[firstPanelIndex]
          let secondPanelSize = newSizes[secondPanelIndex]

          // Adjust delta based on min sizes
          if (delta < 0) {
            // Shrinking first panel, growing second
            const availableSpace =
              firstPanelSize -
              (collapsiblePanels[firstPanelIndex]
                ? newSizes[firstPanelIndex] > collapsedSizes[firstPanelIndex]
                  ? minSizes[firstPanelIndex]
                  : collapsedSizes[firstPanelIndex]
                : minSizes[firstPanelIndex])
            delta = Math.max(delta, -availableSpace)
          } else {
            // Growing first panel, shrinking second
            const availableSpace =
              secondPanelSize -
              (collapsiblePanels[secondPanelIndex]
                ? newSizes[secondPanelIndex] > collapsedSizes[secondPanelIndex]
                  ? minSizes[secondPanelIndex]
                  : collapsedSizes[secondPanelIndex]
                : minSizes[secondPanelIndex])
            delta = Math.min(delta, availableSpace)
          }

          newSizes[firstPanelIndex] += delta
          newSizes[secondPanelIndex] -= delta

          // Handle collapsible panels
          if (collapsiblePanels[firstPanelIndex]) {
            if (newSizes[firstPanelIndex] < minSizes[firstPanelIndex]) {
              newSizes[secondPanelIndex] +=
                newSizes[firstPanelIndex] - collapsedSizes[firstPanelIndex]
              newSizes[firstPanelIndex] = collapsedSizes[firstPanelIndex]
            }
          }

          if (collapsiblePanels[secondPanelIndex]) {
            if (newSizes[secondPanelIndex] < minSizes[secondPanelIndex]) {
              newSizes[firstPanelIndex] +=
                newSizes[secondPanelIndex] - collapsedSizes[secondPanelIndex]
              newSizes[secondPanelIndex] = collapsedSizes[secondPanelIndex]
            }
          }

          return newSizes
        })
      },
      [collapsiblePanels, minSizes, collapsedSizes]
    )

    React.useEffect(() => {
      panelElements.forEach((panel, i) => {
        if (panel) {
          panel.style[direction === "horizontal" ? "width" : "height"] =
            `${sizes[i]}%`
        }
      })
    }, [sizes, direction, panelElements])

    return (
      <PanelGroupContext.Provider
        value={{
          direction,
          groupId,
          panels,
          sizes,
          setSizes,
          minSizes,
          collapsible: collapsiblePanels,
          collapsedSizes,
        }}
      >
        <div
          ref={forwardedRef}
          className={cn(
            "flex w-full",
            direction === "vertical" && "flex-col",
            className
          )}
          {...props}
        >
          {React.Children.map(children, (child, index) => (
            <>
              {index > 0 && (
                <ResizableHandle
                  onResize={(delta) => onResize(index, delta)}
                  direction={direction}
                />
              )}
              {React.cloneElement(child as React.ReactElement, {
                ref: panels[index],
              })}
            </>
          ))}
        </div>
      </PanelGroupContext.Provider>
    )
  }
)
ResizablePanelGroup.displayName = "ResizablePanelGroup"

const ResizablePanel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    defaultSize?: number
    minSize?: number
    collapsible?: boolean
    collapsedSize?: number
  }
>(({ className, children, defaultSize, minSize, collapsible, collapsedSize, ...props }, forwardedRef) => {
  return (
    <div ref={forwardedRef} className={cn("relative", className)} {...props}>
      {children}
    </div>
  )
})
ResizablePanel.displayName = "ResizablePanel"

const ResizableHandle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    onResize: (delta: number) => void
    direction: "horizontal" | "vertical"
    withHandle?: boolean
  }
>(({ className, onResize, direction, withHandle, ...props }, ref) => {
  const handleRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handle = handleRef.current
    if (!handle) return

    const onMouseDown = (e: MouseEvent) => {
      e.preventDefault()
      const start = direction === "horizontal" ? e.clientX : e.clientY

      const onMouseMove = (e: MouseEvent) => {
        const current = direction === "horizontal" ? e.clientX : e.clientY
        const delta =
          (current - start) /
          (direction === "horizontal"
            ? handle.parentElement!.offsetWidth
            : handle.parentElement!.offsetHeight)
        onResize(delta * 100)
      }

      const onMouseUp = () => {
        document.removeEventListener("mousemove", onMouseMove)
        document.removeEventListener("mouseup", onMouseUp)
      }

      document.addEventListener("mousemove", onMouseMove)
      document.addEventListener("mouseup", onMouseUp)
    }

    handle.addEventListener("mousedown", onMouseDown)
    return () => handle.removeEventListener("mousedown", onMouseDown)
  }, [direction, onResize])

  return (
    <div
      ref={handleRef}
      className={cn(
        "group relative transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        direction === "horizontal"
          ? "w-1 cursor-col-resize"
          : "h-1 cursor-row-resize",
        className
      )}
      {...props}
    >
      <Separator
        orientation={direction === "horizontal" ? "vertical" : "horizontal"}
        className={cn(
          "bg-border group-hover:bg-primary group-focus-visible:bg-primary",
          direction === "horizontal" ? "h-full" : "w-full"
        )}
      />
       {withHandle && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="h-8 w-2 rounded-full bg-border group-hover:bg-primary group-focus-visible:bg-primary" />
        </div>
      )}
    </div>
  )
})
ResizableHandle.displayName = "ResizableHandle"

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
