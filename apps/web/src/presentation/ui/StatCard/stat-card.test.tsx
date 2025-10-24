import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import StatCard from "./StatCard";

describe("StatCard", () => {
  it("renders title, value, and description correctly", () => {
    render(
      <StatCard
        title="Total Users"
        value={1234}
        description="Since last month"
      />,
    );

    expect(screen.getByText("Total Users")).toBeInTheDocument();
    expect(screen.getByText("1234")).toBeInTheDocument();
    expect(screen.getByText("Since last month")).toBeInTheDocument();
  });

  it("renders icon when provided", () => {
    const testIcon = <span data-testid="icon">Icon</span>;
    render(
      <StatCard
        title="Test"
        value="100"
        description="Test description"
        icon={testIcon}
      />,
    );

    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("does not render icon container when no icon is provided", () => {
    render(
      <StatCard title="Test" value="100" description="Test description" />,
    );

    const iconElement = screen.queryByTestId("icon");
    expect(iconElement).not.toBeInTheDocument();
  });

  it("applies className prop", () => {
    render(
      <StatCard
        title="Test"
        value="100"
        description="Test description"
        className="custom-class"
        data-testid="stat-card"
      />,
    );

    const statCard = screen.getByTestId("stat-card");
    expect(statCard).toHaveClass("custom-class");
  });

  it("renders different value types correctly", () => {
    const { rerender } = render(
      <StatCard title="Count" value={42} description="Test description" />,
    );

    expect(screen.getByText("42")).toBeInTheDocument();

    rerender(
      <StatCard
        title="Percentage"
        value="25.5%"
        description="Test description"
      />,
    );

    expect(screen.getByText("25.5%")).toBeInTheDocument();
  });
});
