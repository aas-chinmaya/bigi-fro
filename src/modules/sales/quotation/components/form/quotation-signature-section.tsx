"use client";

import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, MouseEvent, TouchEvent } from "react";
import { useFormContext } from "react-hook-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Eraser, FileSignature, Upload, X } from "lucide-react";
import type { QuotationFormValues } from "../../types/quotation-form.types";

export function QuotationSignatureSection() {
  const { setValue } = useFormContext<QuotationFormValues>();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawing, setHasDrawing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.strokeStyle = "#111827";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  const getPosition = (
    e: MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement>,
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const clientX =
      "touches" in e ? (e.touches[0]?.clientX ?? 0) : e.clientX;
    const clientY =
      "touches" in e ? (e.touches[0]?.clientY ?? 0) : e.clientY;

    return {
      x: ((clientX - rect.left) / rect.width) * canvas.width,
      y: ((clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const startDrawing = (
    e: MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement>,
  ) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const { x, y } = getPosition(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (
    e: MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement>,
  ) => {
    if (!isDrawing) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const { x, y } = getPosition(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasDrawing(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const addSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasDrawing) return;

    const dataUrl = canvas.toDataURL("image/png");
    setPreview(dataUrl);
    setValue("signature", dataUrl, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const clearPad = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawing(false);
  };

  const removeSignature = () => {
    setPreview(null);
    setValue("signature", undefined, {
      shouldDirty: true,
      shouldValidate: true,
    });
    clearPad();
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPreview(result);
      setValue("signature", result, {
        shouldDirty: true,
        shouldValidate: true,
      });
      clearPad();
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <Card className="h-full">
      <CardHeader className="px-4 pb-3 pt-4">
        <CardTitle className="text-base font-semibold">
          Authorized Signatory
        </CardTitle>
      </CardHeader>

      <CardContent className="px-4 pb-4 pt-2">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-1">
          <div className="min-w-0">
            <p className="mb-1.5 text-[11px] font-medium text-muted-foreground">
              Signature Preview
            </p>

            <div className="group relative flex h-[130px] items-center justify-center overflow-hidden rounded-lg border bg-white">
              {preview ? (
                <img
                  src={preview}
                  alt="Authorized signatory"
                  className="max-h-24 max-w-[85%] object-contain"
                />
              ) : (
                <FileSignature className="h-5 w-5 text-muted/50" />
              )}

              {preview && (
                <button
                  type="button"
                  onClick={removeSignature}
                  aria-label="Remove signature"
                  className="absolute right-2 top-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-md border bg-white text-muted opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>

          <div className="min-w-0">
            <p className="mb-1.5 text-[11px] font-medium text-muted-foreground">
              Draw Signature
            </p>

            <div className="relative overflow-hidden rounded-lg border bg-white">
              <canvas
                ref={canvasRef}
                width={900}
                height={240}
                className="block h-[130px] w-full cursor-crosshair touch-none select-none"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />

              {!hasDrawing && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <span className="text-[11px] text-muted">Sign here</span>
                </div>
              )}

              {hasDrawing && (
                <button
                  type="button"
                  onClick={clearPad}
                  aria-label="Clear signature"
                  className="absolute right-2 top-2 flex h-6 cursor-pointer items-center gap-1 rounded-md border bg-white px-2 text-[10px] text-muted hover:text-destructive"
                >
                  <Eraser className="h-3 w-3" />
                  Clear
                </button>
              )}
            </div>

            <div className="mt-2 flex flex-wrap justify-end gap-1.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="h-8 cursor-pointer px-3 text-xs"
              >
                <Upload className="mr-1.5 h-3.5 w-3.5" />
                Upload
              </Button>

              <Button
                type="button"
                size="sm"
                disabled={!hasDrawing}
                onClick={addSignature}
                className="h-8 cursor-pointer px-3 text-xs"
              >
                <Check className="mr-1.5 h-3.5 w-3.5" />
                Add
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}