import { FINANCE_METADATA } from "@oss/shared/metadata/finance";

export function VerifyEmail() {
	return (
		<div className="mx-auto mb-8 max-w-prose">
			<div>Revisa tu correo electrónico</div>
			<div className="mb-4 text-muted-foreground italic">
				Hemos enviado un enlace de verificación a tu correo electrónico.
			</div>
			<div className="space-y-4">
				<h3 className="font-semibold text-lg">Próximos pasos:</h3>
				<ol className="ml-4 list-decimal space-y-3 text-muted-foreground">
					<li>
						Busca el correo de verificación de {FINANCE_METADATA.displayName} y
						sigue las instrucciones.
					</li>
				</ol>

				<div className="mb-4 rounded-md bg-primary/5 p-4">
					<p className="mb-1 font-medium text-sm">¿No encuentras el correo?</p>
					<p className="text-muted-foreground text-sm">
						Revisa tu carpeta de spam o correo no deseado. El correo puede
						tardar unos minutos en llegar.
					</p>
				</div>

				<div className="text-center">
					<p className="text-muted-foreground text-sm">
						Puedes cerrar esta pestaña.
					</p>
				</div>
			</div>
		</div>
	);
}
