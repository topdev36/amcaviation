import i18n from "i18next";
import i18nBackend from "i18next-http-backend";
import langEn from "i18n/en.json";
import langPl from "i18n/pl.json";
import { initReactI18next } from "react-i18next";

export default () => {
	i18n
		.use(i18nBackend)
		.use(initReactI18next)
		.init(
			{
				fallbackLng: "en",
				lng: "en",
				react: {
					useSuspense: false,
				},
				interpolation: {
					escapeValue: false,
				},
				resources: {
					en: {
						translation: langEn,
					},
					pl: {
						translation: langPl,
					},
				}
			}
		);
};
