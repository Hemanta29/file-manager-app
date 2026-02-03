/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useRef } from "react";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error

import * as d3 from "d3";

interface Node {
    key: string;
    value: unknown;
    left: Node | null;
    right: Node | null;
}

interface Tree {
    data: unknown;
    root: Node | null;
}

interface FileTreeD3Props {
    fileStructure: Tree;
}

const width = 1000;
const dx = 80;
const dy = 60;

function treeDataFromBST(root: Node | null): any {
    if (!root) return "null";
    return {
        name: root.key,
        children: [
            treeDataFromBST(root.left),
            treeDataFromBST(root.right),
        ].filter(Boolean),
    };
}

const FileTreeD3: React.FC<FileTreeD3Props> = ({ fileStructure }) => {
    console.log(fileStructure);

    const ref = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!fileStructure?.data) return;
        const data = treeDataFromBST(fileStructure.data as Node | null);
        d3.select(ref.current).selectAll("*").remove();
        const root = d3.hierarchy(data);
        const treeLayout = d3.tree().nodeSize([dx, dy]);
        treeLayout(root);

        const svg = d3.select(ref.current)
            .attr("width", width)
            .attr("height", 1000)
            .attr("viewBox", [0, 0, width, 1000].join(" "));

        const g = svg.append("g").attr("transform", `translate(${width / 2}, 40)`);

        // Links
        g.append("g")
            .selectAll("path")
            .data(root.links())
            .join("path")
            .attr("fill", "none")
            .attr("stroke", "#888")
            .attr("stroke-width", 2)
            .attr("d", d3.linkVertical()
                .x((d: any) => d.x)
                .y((d: any) => d.y)
            );

        // Nodes
        const node = g.append("g")
            .selectAll("g")
            .data(root.descendants())
            .join("g")
            .attr("transform", (d: any) => `translate(${d.x},${d.y})`);

        node.append("circle")
            .attr("r", 32)
            .attr("style", "padding:10px;")
            .attr("fill", (d: any) => (d.data.name === undefined ? "#f87171" : "#3b82f6")); // Red if NULL, blue otherwise

        node.append("text")
            .attr("dy", "0.35em")
            .attr("text-anchor", "middle")
            .attr("fill", "Black")
            .text((d: any) => {
                if (!d.data.name || d.data.name === undefined) return "NULL";
                // Remove .txt if present
                return d.data.name.replace(/\.txt$/, "");
            });
    }, [fileStructure]);

    return (
        <div className="overflow-auto h-250 w-full">
            <svg ref={ref}></svg>
        </div>
    );
};

export default FileTreeD3;
