"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Upload } from "lucide-react";

export function Reports() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>データインポート</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            CSVファイルから商品データと棚割り当てをインポートできます。
          </p>
          <div className="grid gap-2">
            <Button variant="outline" className="w-full">
              <Upload className="mr-2 h-4 w-4" />
              商品データインポート
            </Button>
            <Button variant="outline" className="w-full">
              <Upload className="mr-2 h-4 w-4" />
              棚割り当てインポート
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>レポート出力</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            在庫状況と取引履歴のレポートをダウンロードできます。
          </p>
          <div className="grid gap-2">
            <Button variant="outline" className="w-full">
              <Download className="mr-2 h-4 w-4" />
              現在の在庫状況
            </Button>
            <Button variant="outline" className="w-full">
              <Download className="mr-2 h-4 w-4" />
              取引履歴
            </Button>
            <Button variant="outline" className="w-full">
              <Download className="mr-2 h-4 w-4" />
              在庫不足レポート
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}