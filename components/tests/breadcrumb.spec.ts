import type { Mock } from "vitest";
import BreadCrumb from "../homepage/BreadCrumb.vue";
import { shallowMount } from "@vue/test-utils";

vi.stubGlobal("useRoute", vi.fn());
vi.stubGlobal("useRouter", vi.fn());
//watch the route change
describe("BreadCrumb", () => {
  beforeEach(() => {});
  it("should render correctly", () => {
    const routeMock = {
      path: "/some/path",
      matched: [
        { meta: { title: "Page 1" }, name: "page1", path: "/page1" },
        { meta: { title: "Page 2" }, name: "page2", path: "/page2" },
      ],
      params: {},
    };

    (useRoute as unknown as Mock).mockReturnValue(routeMock);
    (useRouter as unknown as Mock).mockReturnValue({});
    const wrapper = shallowMount(BreadCrumb, {
      global: { stubs: { NuxtLink: true } },
    });
    const expectedItems = [
      { title: "Home", href: "/", disabled: false },
      { title: "page1", href: "/page1", disabled: false },
      { title: "page2", href: "/page2", disabled: true },
    ];

    expect((wrapper.vm as any).items).toEqual(expectedItems);
  });
  it("should update items when route changes", async () => {
    const routeMock = {
      path: "/some/path",
      matched: [
        { meta: { title: "page1" }, name: "page1", path: "/page1" },
        { meta: { title: "page2" }, name: "page2", path: "/page2" },
        { meta: { title: "page3" }, name: "page3", path: "/page3" },
      ],
      params: {},
    };

    (useRoute as unknown as Mock).mockReturnValue(routeMock);
    (useRouter as unknown as Mock).mockReturnValue({});
    const wrapper = shallowMount(BreadCrumb, {
      global: { stubs: { NuxtLink: true } },
    });

    const expectedItems = [
      { title: "Home", href: "/", disabled: false },
      { title: "page1", href: "/page1", disabled: false },
      { title: "page2", href: "/page2", disabled: false },
      { title: "page3", href: "/page3", disabled: true },
    ];

    expect((wrapper.vm as any).items).toEqual(expectedItems);

    const newRouteMock = {
      path: "/some/path",
      matched: [
        { meta: { title: "page1" }, name: "page1", path: "/page1" },
        { meta: { title: "page2" }, name: "page2", path: "/page2" },
        { meta: { title: "page3" }, name: "page3", path: "/page3" },
      ],
      params: {},
    };
    (useRoute as unknown as Mock).mockReturnValue(newRouteMock);
    await nextTick();

    const newExpectedItems = [
      { title: "Home", href: "/", disabled: false },
      { title: "page1", href: "/page1", disabled: false },
      { title: "page2", href: "/page2", disabled: false },
      { title: "page3", href: "/page3", disabled: true },
    ];

    await nextTick();
    expect((wrapper.vm as any).items).toEqual(newExpectedItems);
  });
});
