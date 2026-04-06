"use client";

import React from "react";
import { 
  CmsSection, 
  CmsHeading, 
  CmsParagraph, 
  CmsImage, 
  CmsButton, 
  CmsList,
  CmsCta,
  CmsCards,
  CmsFeatures,
  CmsTestimonial
} from "./blocks/CmsBlocks";
import { PageBlock } from "@/lib/store/pages/pageType";

interface CmsRendererProps {
  content: any[];
  isNested?: boolean;
}

export const CmsRenderer: React.FC<CmsRendererProps> = ({ content, isNested = false }) => {
  if (!content || !Array.isArray(content)) return null;

  return (
    <div className="w-full">
      {content.map((item) => {
        switch (item.type) {
          case "section":
            if (item.columns && item.columns.length > 0) {
              return (
                <CmsSection key={item.id} layout={item.layout} isNested={isNested}>
                  {item.columns.map((col: any[], colIdx: number) => (
                    <div key={colIdx} className="w-full h-full">
                      <CmsRenderer content={col} isNested={true} />
                    </div>
                  ))}
                </CmsSection>
              );
            }
            return (
              <CmsSection key={item.id} layout={item.layout} isNested={isNested}>
                <CmsRenderer content={item.content} isNested={true} />
              </CmsSection>
            );
          case "heading":
            return <CmsHeading key={item.id} text={item.text} level={item.level} />;
          case "paragraph":
            return <CmsParagraph key={item.id} text={item.text} />;
          case "image":
            return <CmsImage key={item.id} url={item.url} alt={item.alt} />;
          case "button":
            return <CmsButton key={item.id} label={item.label} link={item.link} />;
          case "cta":
            return <CmsCta key={item.id} {...item} />;
          case "cards":
            return <CmsCards key={item.id} items={item.items} />;
          case "features":
            return <CmsFeatures key={item.id} items={item.items} />;
          case "testimonial":
            return <CmsTestimonial key={item.id} {...item} />;
          case "list":
            return <CmsList key={item.id} items={item.items} />;
          default:
            return null;
        }
      })}
    </div>
  );
};
