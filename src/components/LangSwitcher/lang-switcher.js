"use client";

import { useEffect, useState, useTransition } from "react";
import { parseCookies, setCookie } from "nookies";
import usaFlag from "../../assets/images/navbar/usa.svg";
import frenchFlag from "../../assets/images/navbar/france.svg";
import germanFlag from "../../assets/images/navbar/GermanFlag.svg";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { Dropdown } from "antd";
import { Check } from "lucide-react";
import { supportedLanguages } from "@/constants/language.contants";

// The following cookie name is important because it's Google-predefined for the translation engine purpose
const COOKIE_NAME = "googtrans";

const flags = {
  en: { flag: usaFlag, title: "English" },
  fr: { flag: frenchFlag, title: "France" },
  // ar: { flag: algerianFlag, title: "Arabic" },
  // bn: { flag: bangladeshFlag, title: "Bangla" },
  de: { flag: germanFlag, title: "German" },
};

const LanguageSwitcher = () => {
  const [currentLanguage, setCurrentLanguage] = useState();
  const [languageConfig, setLanguageConfig] = useState();

  // When the component has initialized, we must activate the translation engine the following way.
  useEffect(() => {
    // 1. Read the cookie
    const cookies = parseCookies();
    const existingLanguageCookieValue = cookies[COOKIE_NAME];

    let languageValue;
    if (existingLanguageCookieValue) {
      // 2. If the cookie is defined, extract a language nickname from there.
      const sp = existingLanguageCookieValue.split("/");
      if (sp.length > 2) {
        languageValue = sp[2];
      }
    }
    // 3. If __GOOGLE_TRANSLATION_CONFIG__ is defined and we still not decided about languageValue, let's take a current language from the predefined defaultLanguage below.
    if (global.__GOOGLE_TRANSLATION_CONFIG__ && !languageValue) {
      languageValue = global.__GOOGLE_TRANSLATION_CONFIG__.defaultLanguage;
    }
    if (languageValue) {
      // 4. Set the current language if we have a related decision.
      setCurrentLanguage(languageValue);
    }
    // 5. Set the language config.
    if (global.__GOOGLE_TRANSLATION_CONFIG__) {
      setLanguageConfig(global.__GOOGLE_TRANSLATION_CONFIG__);
    }
  }, []);

  // Don't display anything if current language information is unavailable.
  if (!currentLanguage || !languageConfig) {
    return null;
  }

  // The following function switches the current language
  const switchLanguage = (lang) => () => {
    // We just need to set the related cookie and reload the page
    // "/auto/" prefix is Google's definition as far as a cookie name
    setCookie(null, COOKIE_NAME, "/auto/" + lang);
    window.location.reload();
  };

  return (
    <div className="notranslate text-center">
      <Dropdown
        menu={{
          items: supportedLanguages.map((ld) => ({
            key: ld.name,
            label: (
              <>
                {currentLanguage === ld.name ||
                (currentLanguage === "auto" &&
                  languageConfig.defaultLanguage === ld) ? (
                  <button
                    key={`l_s_${ld}`}
                    className="flex-center-start notranslate gap-x-2 !text-base"
                  >
                    <Image
                      src={ld.icon}
                      alt={ld.title}
                      height={22}
                      width={22}
                      className="rounded-lg"
                    />

                    {ld.title}

                    <Check size={16} className="text-gray-500" />
                  </button>
                ) : (
                  <button
                    key={`l_s_${ld}`}
                    onClick={switchLanguage(ld.name)}
                    className="flex-center-start notranslate gap-x-2 !text-base"
                  >
                    <Image
                      src={ld.icon}
                      alt={ld.title}
                      height={22}
                      width={22}
                      className="rounded-lg"
                    />

                    {ld.title}
                  </button>
                )}
              </>
            ),
          })),
        }}
        trigger={["click"]}
      >
        <button className="flex-center-start gap-x-1">
          <Image
            src={flags[currentLanguage]?.flag}
            alt={flags[currentLanguage]?.title}
            height={32}
            width={32}
            className="rounded-lg"
          />

          <Icon icon="icon-park-solid:down-one" width="18px" height="18px" />
        </button>
      </Dropdown>
    </div>
  );
};

export { LanguageSwitcher, COOKIE_NAME };
