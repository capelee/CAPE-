import React from "react";
import { VideoMultimediaDecor } from "./decors/VideoMultimediaDecor";
import { CisLogoDecor } from "./decors/CisLogoDecor";
import { LandingWaterfallDecor } from "./decors/LandingWaterfallDecor";
import { MerchandiseGiftsDecor } from "./decors/MerchandiseGiftsDecor";
import { StoreExhibitionDecor } from "./decors/StoreExhibitionDecor";
import { PrintPosterDecor } from "./decors/PrintPosterDecor";
import { BusinessPrintDecor } from "./decors/BusinessPrintDecor";
import { IpIllustrationDecor } from "./decors/IpIllustrationDecor";
import { StoreBannerDecor } from "./decors/StoreBannerDecor";
import { CommercialPhotoDecor } from "./decors/CommercialPhotoDecor";
import { SocialMarketingDecor } from "./decors/SocialMarketingDecor";
import { ECommerceProductSalesDecor } from "./decors/ECommerceProductSalesDecor";

interface HeroCategoryDecorProps {
  selectedCategory: string;
  theme: "dark" | "light" | "sepia";
}

export const HeroCategoryDecor: React.FC<HeroCategoryDecorProps> = ({
  selectedCategory,
  theme
}) => {
  // Disable SVG background animation for "亮點設計" and "All" (全部精選展示)
  if (
    !selectedCategory ||
    selectedCategory === "亮點設計" ||
    selectedCategory === "All" ||
    selectedCategory === "全部" ||
    selectedCategory === "全部精選展示"
  ) {
    return null;
  }

  if (selectedCategory === "影音與多媒體設計" || selectedCategory.includes("影音")) {
    return <VideoMultimediaDecor theme={theme} />;
  }

  if (selectedCategory === "企業LOGO與CIS設計" || selectedCategory.includes("LOGO") || selectedCategory.includes("CIS")) {
    return <CisLogoDecor theme={theme} />;
  }

  if (selectedCategory === "網站產品瀑布頁" || selectedCategory.includes("瀑布頁")) {
    return <LandingWaterfallDecor theme={theme} />;
  }

  if (selectedCategory === "商品周邊企業禮贈品" || selectedCategory.includes("禮贈品")) {
    return <MerchandiseGiftsDecor theme={theme} />;
  }

  if (selectedCategory === "實體店面與展覽" || selectedCategory.includes("實體店面") || selectedCategory.includes("展覽")) {
    return <StoreExhibitionDecor theme={theme} />;
  }

  if (selectedCategory === "平面海報廣告設計" || selectedCategory.includes("平面海報")) {
    return <PrintPosterDecor theme={theme} />;
  }

  if (selectedCategory === "商務印刷品設計" || selectedCategory.includes("商務印刷")) {
    return <BusinessPrintDecor theme={theme} />;
  }

  if (
    selectedCategory === "角色 IP & 插畫與貼圖" ||
    selectedCategory === "角色IP&插畫與貼圖" ||
    selectedCategory.includes("角色IP") ||
    selectedCategory.includes("角色 IP") ||
    selectedCategory.includes("插畫")
  ) {
    return <IpIllustrationDecor theme={theme} />;
  }

  if (
    selectedCategory === "賣場 Banner 橫幅廣告" ||
    selectedCategory === "賣場Banner橫幅廣告" ||
    selectedCategory.includes("賣場Banner") ||
    selectedCategory.includes("賣場 Banner") ||
    selectedCategory.includes("橫幅")
  ) {
    return <StoreBannerDecor theme={theme} />;
  }

  if (
    selectedCategory === "商業視覺攝影" ||
    selectedCategory.includes("商業視覺") ||
    selectedCategory.includes("攝影")
  ) {
    return <CommercialPhotoDecor theme={theme} />;
  }

  if (
    selectedCategory === "社群行銷小編圖文" ||
    selectedCategory.includes("社群行銷") ||
    selectedCategory.includes("社群") ||
    selectedCategory.includes("小編") ||
    selectedCategory.includes("圖文") ||
    selectedCategory.includes("Social")
  ) {
    return <SocialMarketingDecor theme={theme} />;
  }

  if (
    selectedCategory === "電商產品銷售圖" ||
    selectedCategory.includes("電商產品") ||
    selectedCategory.includes("銷售圖") ||
    selectedCategory.includes("產品圖")
  ) {
    return <ECommerceProductSalesDecor theme={theme} />;
  }

  return null;
};
