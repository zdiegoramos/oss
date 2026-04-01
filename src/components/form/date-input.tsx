import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { Matcher } from "react-day-picker";
import { es } from "react-day-picker/locale";
import type { ZodType } from "zod/v4";
import { FieldInfo } from "@/components/form/field-info";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { buttonVariants } from "../ui/button";
import { useFieldContext } from ".";

export function DateInput({
  schema,
  modifiers,
}: {
  schema?: ZodType<unknown, unknown>;
  modifiers?: Record<string, Matcher | Matcher[] | undefined> | undefined;
}) {
  const field = useFieldContext<Date>();

  const value = field.state.value;

  const buttonText =
    value instanceof Date ? (
      format(field.state.value, "PP", { locale: es })
    ) : (
      <span>Selecciona una fecha</span>
    );

  return (
    <div>
      <Label htmlFor={field.name} schema={schema} />
      <Popover>
        <div>
          <PopoverTrigger
            className={buttonVariants({ variant: "outline" })}
            data-empty={value instanceof Date === false}
          >
            <CalendarIcon />
            {buttonText}
          </PopoverTrigger>
        </div>
        <PopoverContent className="w-auto p-0">
          <Calendar
            locale={es}
            mode="single"
            modifiers={modifiers}
            onSelect={(date) => {
              if (date instanceof Date) {
                field.handleChange(date);
              }
            }}
            selected={value}
          />
        </PopoverContent>
      </Popover>
      <FieldInfo field={field} />
    </div>
  );
}
